import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../services/firebase';
import { useRouter } from 'expo-router';

function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, '').slice(0, 11); // Remove não numéricos e limita a 11 dígitos

  if (numbers.length < 3) {
    return numbers; // Se ainda digitando DDD
  }

  if (numbers.length <= 7) {
    return numbers.replace(/^(\d{2})(\d{1})/, '($1) $2'); // DDD + 9
  }

  if (numbers.length <= 11) {
    return numbers.replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4'); // (DD) 9 XXXX-XXXX
  }

  return numbers;
}

export default function EditarPerfilScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);

  const handlePhoneChange = (text: string) => {
    const formattedText = formatPhoneNumber(text);
    setPhoneNumber(formattedText);
  };

  useEffect(() => {
    async function fetchProfile() {
      if (user?.uid) {
        try {
          const docRef = doc(db, "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setDisplayName(data.nome || user.displayName || ''); 
            setPhoneNumber(data.phoneNumber || '');
          } else {
            setDisplayName(user.displayName || ''); 
            setPhoneNumber('');
          }
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
        } finally {
          setLoading(false); 
        }
      }
    }
    fetchProfile();
  }, [user]);

  async function handleSave() {
    if (!displayName.trim()) {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }

    try {
      setLoading(true);

      await setDoc(doc(db, 'usuarios', user!.uid), {
        uid: user!.uid,
        email: user!.email,
        nome: displayName,
        phoneNumber: phoneNumber,
      });

      router.push('../(perfil)');
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#f90" style={{ marginVertical: 16 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#aaa"
        value={displayName}
        onChangeText={setDisplayName}
      />


<TextInput
  style={styles.input}
  placeholder="(DD) 9 XXXX-XXXX"
  placeholderTextColor="#aaa"
  value={formatPhoneNumber(phoneNumber)}
  onChangeText={(text) => setPhoneNumber(text)}
  keyboardType="numeric"
/>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f90',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    color: '#fff',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#f90',
    borderRadius: 8,
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
